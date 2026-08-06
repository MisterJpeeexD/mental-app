-- Migración no destructiva para instalaciones existentes.
-- Antes de ejecutar, completa cualquier RUT nulo o duplicado con datos reales.
BEGIN;

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS run VARCHAR(12);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM usuarios WHERE run IS NULL OR BTRIM(run) = '') THEN
        RAISE EXCEPTION 'Existen usuarios sin RUT. Completa esos valores antes de aplicar NOT NULL.';
    END IF;

    IF EXISTS (SELECT run FROM usuarios GROUP BY run HAVING COUNT(*) > 1) THEN
        RAISE EXCEPTION 'Existen RUT duplicados. Corrígelos antes de crear la restricción única.';
    END IF;
END $$;

ALTER TABLE usuarios ALTER COLUMN run TYPE VARCHAR(12);
ALTER TABLE usuarios ALTER COLUMN run SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS ux_usuarios_run ON usuarios (run);

COMMIT;
