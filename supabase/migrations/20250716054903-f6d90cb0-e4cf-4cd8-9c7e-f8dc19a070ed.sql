
-- First, let's check if super_admin enum value exists and add it if needed
DO $$
BEGIN
    -- Add super_admin to app_role enum if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'super_admin' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'app_role')
    ) THEN
        ALTER TYPE public.app_role ADD VALUE 'super_admin';
        RAISE NOTICE 'Added super_admin to app_role enum';
    ELSE
        RAISE NOTICE 'super_admin already exists in app_role enum';
    END IF;
END $$;

-- Now update the specific user's role
DO $$
DECLARE
    target_user_id uuid;
    current_role_count integer;
BEGIN
    -- Find the user ID for pratic.panda@gmail.com
    SELECT id INTO target_user_id 
    FROM public.profiles 
    WHERE email = 'pratic.panda@gmail.com' 
    LIMIT 1;
    
    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User pratic.panda@gmail.com not found in profiles table';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user ID: %', target_user_id;
    
    -- Check current roles
    SELECT COUNT(*) INTO current_role_count
    FROM public.user_roles 
    WHERE user_id = target_user_id;
    
    RAISE NOTICE 'User currently has % roles', current_role_count;
    
    -- Delete ALL existing roles for this user
    DELETE FROM public.user_roles 
    WHERE user_id = target_user_id;
    
    RAISE NOTICE 'Deleted all existing roles for user';
    
    -- Insert the super_admin role
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (target_user_id, 'super_admin', target_user_id);
    
    RAISE NOTICE 'Successfully assigned super_admin role to user: %', target_user_id;
    
    -- Verify the assignment
    IF EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = target_user_id AND role = 'super_admin'
    ) THEN
        RAISE NOTICE 'Verification successful: super_admin role is now assigned';
    ELSE
        RAISE NOTICE 'Verification failed: super_admin role was not assigned';
    END IF;
END $$;

-- Final verification query
SELECT 
    p.email,
    p.first_name,
    p.last_name,
    ur.role,
    ur.assigned_at
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
WHERE p.email = 'pratic.panda@gmail.com'
ORDER BY ur.assigned_at DESC;
