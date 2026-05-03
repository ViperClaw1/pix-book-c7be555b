ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_first_name_length CHECK (char_length(first_name) <= 50),
  ADD CONSTRAINT profiles_last_name_length CHECK (char_length(last_name) <= 50),
  ADD CONSTRAINT profiles_phone_length CHECK (phone IS NULL OR char_length(phone) <= 20);