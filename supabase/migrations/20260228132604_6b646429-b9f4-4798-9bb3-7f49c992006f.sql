
-- 1. Create enum for shopping item types
CREATE TYPE public.shopping_item_type AS ENUM ('main', 'sauce', 'beverage');

-- 2. Create shopping_items table
CREATE TABLE public.shopping_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_card_id UUID NOT NULL REFERENCES public.business_cards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  item_type public.shopping_item_type NOT NULL DEFAULT 'main',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shopping items"
ON public.shopping_items FOR SELECT USING (true);

-- 3. Create shopping_cart_items table
CREATE TABLE public.shopping_cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  shopping_item_id UUID NOT NULL REFERENCES public.shopping_items(id) ON DELETE CASCADE,
  business_card_id UUID NOT NULL REFERENCES public.business_cards(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  parent_id UUID REFERENCES public.shopping_cart_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shopping_cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own shopping cart"
ON public.shopping_cart_items FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users insert own shopping cart"
ON public.shopping_cart_items FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own shopping cart"
ON public.shopping_cart_items FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users delete own shopping cart"
ON public.shopping_cart_items FOR DELETE USING (user_id = auth.uid());

-- 4. Insert Shopping category
INSERT INTO public.categories (id, name, business_cards_count)
VALUES ('a4444444-4444-4444-4444-444444444444', 'Shopping', 2);

-- 5. Insert Shopping business cards
INSERT INTO public.business_cards (id, category_id, name, image, address, rating, booking_price, tags, description, phone, type)
VALUES
  ('b7777777-7777-7777-7777-777777777777', 'a4444444-4444-4444-4444-444444444444', 'Mega Store', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800', '45 Commerce Ave, Almaty', 4.5, 0, ARRAY['Electronics','Home','Fashion'], 'Your one-stop shop for electronics, home goods, and fashion.', '+7 701 555 0101', 'featured'),
  ('b8888888-8888-8888-8888-888888888888', 'a4444444-4444-4444-4444-444444444444', 'Tech Mall', 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800', '12 Innovation Blvd, Almaty', 4.3, 0, ARRAY['Gadgets','Computers','Phones'], 'The latest gadgets, computers, and smartphones at great prices.', '+7 701 555 0202', 'recommended');

-- 6. Insert shopping items for Shopping business cards
INSERT INTO public.shopping_items (business_card_id, name, image, price, item_type) VALUES
  ('b7777777-7777-7777-7777-777777777777', 'Wireless Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 15000, 'main'),
  ('b7777777-7777-7777-7777-777777777777', 'Smart Watch', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 45000, 'main'),
  ('b7777777-7777-7777-7777-777777777777', 'Backpack', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 8500, 'main'),
  ('b8888888-8888-8888-8888-888888888888', 'Laptop Stand', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 12000, 'main'),
  ('b8888888-8888-8888-8888-888888888888', 'Mechanical Keyboard', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', 25000, 'main'),
  ('b8888888-8888-8888-8888-888888888888', 'USB-C Hub', 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400', 7500, 'main');

-- 7. Insert food items for Restaurant business cards
INSERT INTO public.shopping_items (business_card_id, name, image, price, item_type) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Classic Burger', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 2500, 'main'),
  ('b1111111-1111-1111-1111-111111111111', 'Margherita Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 3200, 'main'),
  ('b1111111-1111-1111-1111-111111111111', 'Caesar Salad', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400', 1800, 'main'),
  ('b3333333-3333-3333-3333-333333333333', 'Craft Burger', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', 2800, 'main'),
  ('b3333333-3333-3333-3333-333333333333', 'Fish & Chips', 'https://images.unsplash.com/photo-1580217593608-61931ceac39e?w=400', 3500, 'main'),
  ('b3333333-3333-3333-3333-333333333333', 'Pasta Carbonara', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', 2900, 'main');

-- 8. Insert additional items (sauces & beverages) for both restaurants
INSERT INTO public.shopping_items (business_card_id, name, image, price, item_type) VALUES
  ('b1111111-1111-1111-1111-111111111111', 'Ketchup', '', 200, 'sauce'),
  ('b1111111-1111-1111-1111-111111111111', 'Mayo', '', 200, 'sauce'),
  ('b1111111-1111-1111-1111-111111111111', 'BBQ Sauce', '', 250, 'sauce'),
  ('b1111111-1111-1111-1111-111111111111', 'Cola', '', 500, 'beverage'),
  ('b1111111-1111-1111-1111-111111111111', 'Orange Juice', '', 600, 'beverage'),
  ('b1111111-1111-1111-1111-111111111111', 'Water', '', 300, 'beverage'),
  ('b3333333-3333-3333-3333-333333333333', 'Ketchup', '', 200, 'sauce'),
  ('b3333333-3333-3333-3333-333333333333', 'Mayo', '', 200, 'sauce'),
  ('b3333333-3333-3333-3333-333333333333', 'BBQ Sauce', '', 250, 'sauce'),
  ('b3333333-3333-3333-3333-333333333333', 'Cola', '', 500, 'beverage'),
  ('b3333333-3333-3333-3333-333333333333', 'Lemonade', '', 550, 'beverage'),
  ('b3333333-3333-3333-3333-333333333333', 'Water', '', 300, 'beverage');
