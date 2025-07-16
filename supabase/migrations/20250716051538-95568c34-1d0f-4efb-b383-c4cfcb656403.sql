
-- Update pratic.panda@gmail.com from admin to super_admin role
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the user ID for pratic.panda@gmail.com
    SELECT id INTO user_uuid 
    FROM public.profiles 
    WHERE email = 'pratic.panda@gmail.com' 
    LIMIT 1;
    
    -- If user exists, update their role from admin to super_admin
    IF user_uuid IS NOT NULL THEN
        -- Remove the admin role
        DELETE FROM public.user_roles 
        WHERE user_id = user_uuid AND role = 'admin';
        
        -- Add the super_admin role
        INSERT INTO public.user_roles (user_id, role, assigned_by)
        VALUES (user_uuid, 'super_admin', user_uuid)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;
