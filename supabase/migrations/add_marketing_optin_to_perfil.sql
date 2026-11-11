-- Agrega columna marketing_optin a la tabla perfil
ALTER TABLE perfil ADD COLUMN IF NOT EXISTS marketing_optin boolean NOT NULL DEFAULT false;
