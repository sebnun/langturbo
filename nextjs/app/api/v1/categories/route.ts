import { type NextRequest } from "next/server";
import { CATEGORIES, LANGUAGE_CATEGORIES } from "@/lib/categories";
import { db } from "@/db";
import { showsTable } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { getLanguageCodeById } from "@/lib/languages-legacy";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const languageId = Number(searchParams.get("languageId"));
  const categoryId = Number(searchParams.get("categoryId"));
  const popular = searchParams.get("popular") === "true";

  // categoryId 0 = main screen, all top categories and top podcasts
  // categoryId 1 = top podcasts

  // TODO update this to use new podcasts reguarly
  const thisLanguageCategories = LANGUAGE_CATEGORIES.find((lc) => lc.languageId === +languageId!)!.categories;

  let categories: CategoryResponseItem[] = [];

  if (categoryId === 0) {
    categories = CATEGORIES.filter((cat) => thisLanguageCategories.includes(cat.id))
      .map((category) => ({
        id: category.id,
        name: category.localizations.en,
        podcasts: [],
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    categories.unshift({ id: 1, name: "Top Podcasts", podcasts: [] });
  } else if (categoryId === 1) {
    categories = [
      {
        id: 1,
        name: "Top Podcasts",
        podcasts: [],
      },
    ];
  } else if (popular) {
    for (const cat of CATEGORIES) {
      // Search main category
      if (cat.id === +categoryId!) {
        categories.push({
          id: cat.id,
          name: cat.localizations.en,
          podcasts: [],
        });

        break;
      }
    }
  } else {
    // If it has subcategories show them horizontally, so main category should also be shown horizontal, else show 100 podcasts
    // Subcategories can be unavailable per language, so need to check, but no need to check main categories

    for (const cat of CATEGORIES) {
      // Search main category
      if (cat.id === +categoryId!) {
        categories.push({
          id: cat.id,
          name: `Top in ${cat.localizations.en}`,
          podcasts: [],
        });

        if (cat.subcategories) {
          cat.subcategories.forEach((subcat) => {
            if (thisLanguageCategories.includes(subcat.id)) {
              categories.push({
                id: subcat.id,
                name: subcat.localizations.en,
                podcasts: [],
              });
            }
          });
        }

        break;
      }

      if (cat.subcategories) {
        for (const subcat of cat.subcategories) {
          if (subcat.id === +categoryId! && thisLanguageCategories.includes(subcat.id)) {
            categories.push({
              id: subcat.id,
              name: subcat.localizations.en,
              podcasts: [],
            });

            break;
          }
        }
      }
    }
  }

  const categoryRowsPromises = categories.map((category) =>
    category.id === 1
      ? db
          .select()
          .from(showsTable)
          .where(eq(showsTable.language_code, getLanguageCodeById(languageId)!))
          .orderBy(desc(showsTable.popularity))
          .limit(categories.length === 1 ? 100 : 40)
      : db
          .select()
          .from(showsTable)
          .where(
            and(
              eq(showsTable.language_code, getLanguageCodeById(languageId)!),
              sql`${category.id} = ANY(${showsTable.category_ids})`
            )
          )
          .orderBy(desc(showsTable.popularity))
          .limit(categories.length === 1 ? 100 : 40)
  );

  const categoryRows = await Promise.all(categoryRowsPromises);

  for (let i = 0; i < categoryRows.length; i++) {
    categories[i].podcasts = categoryRows[i].map((row) => ({
      id: row.id,
      title: row.title,
      imageUrl: row.image_url,
      feedUrl: row.source_url!,
      description: row.description || "",
      author: row.author || "",
      country: row.country || "",
    }));
  }

  return Response.json({ categories });
}
