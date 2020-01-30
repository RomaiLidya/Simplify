--
-- ENABLE trigram extension
--

CREATE EXTENSION pg_trgm WITH SCHEMA shared;

--
-- Create trigram index (wellac)
--

CREATE INDEX trgm_idx_userprofiles_displayname on wellac."UserProfile" using gin ("displayName" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_userprofiles_email on wellac."UserProfile" using gin ("email" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_client_name on wellac."Client" using gin ("name" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_client_contactnumber on wellac."Client" using gin ("contactNumber" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_client_billingaddress on wellac."Client" using gin ("billingAddress" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_service_item_template_name on wellac."ServiceItemTemplate" using gin ("name" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_service_item_template_description on wellac."ServiceItemTemplate" using gin ("description" shared.gin_trgm_ops);
CREATE INDEX idx_service_item_template_unitPrice on wellac."ServiceItemTemplate"("unitPrice");
CREATE INDEX trgm_idx_vehicle_carplatenumber on wellac."Vehicle" using gin ("carplateNumber" shared.gin_trgm_ops);
CREATE INDEX idx_vehicle_coeexpirydate on wellac."Vehicle"("coeExpiryDate");
CREATE INDEX trgm_idx_service_serviceNumber on wellac."Service" using gin ("serviceNumber" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_service_description on wellac."Service" using gin ("description" shared.gin_trgm_ops);
CREATE INDEX idx_service_termStart on wellac."Service"("termStart");
CREATE INDEX idx_service_termEnd on wellac."Service"("termEnd");

--
-- Create trigram index
--

CREATE INDEX trgm_idx_userprofiles_displayname on airple."UserProfile" using gin ("displayName" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_userprofiles_email on airple."UserProfile" using gin ("email" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_client_name on airple."Client" using gin ("name" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_client_contactnumber on airple."Client" using gin ("contactNumber" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_client_billingaddress on airple."Client" using gin ("billingAddress" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_service_item_template_name on airple."ServiceItemTemplate" using gin ("name" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_service_item_template_description on airple."ServiceItemTemplate" using gin ("description" shared.gin_trgm_ops);
CREATE INDEX idx_service_item_template_unitPrice on airple."ServiceItemTemplate"("unitPrice");
CREATE INDEX trgm_idx_vehicle_carplatenumber on airple."Vehicle" using gin ("carplateNumber" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_vehicle_coeexpirydate on airple."Vehicle"("coeExpiryDate");
CREATE INDEX trgm_idx_service_serviceNumber on airple."Service" using gin ("serviceNumber" shared.gin_trgm_ops);
CREATE INDEX trgm_idx_service_description on airple."Service" using gin ("description" shared.gin_trgm_ops);
CREATE INDEX idx_service_termStart on airple."Service"("termStart");
CREATE INDEX idx_service_termEnd on airple."Service"("termEnd");
