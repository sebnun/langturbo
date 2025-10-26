module "ingress" {
  source = "./modules/nginx-ingress"
  compartment_id = var.compartment_id
}