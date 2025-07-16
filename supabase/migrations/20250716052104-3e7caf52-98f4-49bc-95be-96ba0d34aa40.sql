
-- First, let's ensure the super_admin enum value exists
DO $$
BEGIN
    -- Check if super_admin already exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'super_admin' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')) THEN
        ALTER TYPE public.app_role ADD VALUE 'super_admin';
    END IF;
END $$;

-- Now let's handle the user role assignment more comprehensively
DO $$
DECLARE
    user_uuid uuid;
    profile_exists boolean := false;
BEGIN
    -- First, try to find the user in profiles table
    SELECT id INTO user_uuid 
    FROM public.profiles 
    WHERE email = 'pratic.panda@gmail.com' 
    LIMIT 1;
    
    -- Check if we found the user in profiles
    IF user_uuid IS NOT NULL THEN
        profile_exists := true;
        RAISE NOTICE 'Found user in profiles: %', user_uuid;
    ELSE
        -- Try to find in auth.users if profile doesn't exist
        SELECT id INTO user_uuid 
        FROM auth.users 
        WHERE email = 'pratic.panda@gmail.com' 
        LIMIT 1;
        
        IF user_uuid IS NOT NULL THEN
            RAISE NOTICE 'Found user in auth.users, creating profile: %', user_uuid;
            -- Create the profile if it doesn't exist
            INSERT INTO public.profiles (id, first_name, last_name, email)
            VALUES (user_uuid, 'Pratik', 'Panda', 'pratic.panda@gmail.com')
            ON CONFLICT (id) DO NOTHING;
            profile_exists := true;
        END IF;
    END IF;
    
    -- If we have a user, update their roles
    IF user_uuid IS NOT NULL AND profile_exists THEN
        -- Remove any existing admin role
        DELETE FROM public.user_roles 
        WHERE user_id = user_uuid AND role = 'admin';
        
        -- Remove any existing super_admin role (to avoid conflicts)
        DELETE FROM public.user_roles 
        WHERE user_id = user_uuid AND role = 'super_admin';
        
        -- Add the super_admin role
        INSERT INTO public.user_roles (user_id, role, assigned_by)
        VALUES (user_uuid, 'super_admin', user_uuid);
        
        RAISE NOTICE 'Successfully assigned super_admin role to user: %', user_uuid;
    ELSE
        RAISE NOTICE 'User pratic.panda@gmail.com not found in either profiles or auth.users tables';
    END IF;
END $$;

-- Let's also verify the result
SELECT 
    p.email,
    p.first_name,
    p.last_name,
    ur.role
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'pratic.panda@gmail.com';
