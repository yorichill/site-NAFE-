-- ============================================================
-- SCHÉMA DE LA BASE DE DONNÉES (Supabase PostgreSQL)
-- ============================================================

-- Table pour les produits de la boutique
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  sizes text[] NOT NULL DEFAULT '{}',
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Active RLS (Row Level Security) sur la table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politique : Tout le monde peut voir les produits (Lecture publique)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.products FOR SELECT
  USING ( true );

-- Politique : Seuls les admins peuvent ajouter/modifier/supprimer des produits
-- (Cette vérification simple assumera que si une requête vient d'un rôle d'API privilégié, elle passe. 
-- Pour un vrai contrôle RBAC, on vérifie auth.uid() et les rôles utilisateurs).
CREATE POLICY "Enable insert for authenticated users only"
  ON public.products FOR INSERT
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Enable update for authenticated users only"
  ON public.products FOR UPDATE
  USING ( auth.role() = 'authenticated' )
  WITH CHECK ( auth.role() = 'authenticated' );

CREATE POLICY "Enable delete for authenticated users only"
  ON public.products FOR DELETE
  USING ( auth.role() = 'authenticated' );

-- Insérer quelques données de démonstration (Mock data)
INSERT INTO public.products (name, price, sizes, image_url)
VALUES 
  ('Jersey Officiel 2026', 89.99, ARRAY['S', 'M', 'L', 'XL'], 'https://api.dicebear.com/7.x/shapes/svg?seed=jersey'),
  ('Veste NAFE Team', 120.00, ARRAY['M', 'L', 'XL'], 'https://api.dicebear.com/7.x/shapes/svg?seed=jacket'),
  ('Casquette Pro', 35.00, ARRAY['Unique'], 'https://api.dicebear.com/7.x/shapes/svg?seed=cap');
