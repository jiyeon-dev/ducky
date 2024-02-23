import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/useAction";
import { createUser } from "@/actions/auth/createUser";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/Kanban/form/formInput";
import { FormSubmit } from "@/components/Kanban/form/formSubmit";
import AvatarSelect from "@/components/AvatarSelect";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RegisterPage() {
  const navigate = useNavigate();

  const { execute, isLoading, fieldErrors } = useAction(createUser, {
    onSuccess: () => {
      navigate("/login");
    },
    onError(error) {
      toast.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    execute({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      username: formData.get("username") as string,
      avatar: formData.get("avatar") as string,
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <CardHeader className='text-center select-none'>
        <CardTitle
          className={cn(
            "text-5xl font-[TTHakgyoansimMulgyeolB] z-20 text-yellow-400"
          )}
        >
          <Link to='/'>DUCKY</Link>
        </CardTitle>
        <CardDescription className='capitalize'>Register</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <FormInput
            id='email'
            type='email'
            placeholder='Email'
            autoComplete='off'
            className='text-sm px-[7px] py-1 h-10 font-medium'
            errors={fieldErrors}
          />
          <FormInput
            id='password'
            type='password'
            placeholder='Password'
            autoComplete='off'
            className='text-sm px-[7px] py-1 h-10 font-medium'
            errors={fieldErrors}
          />
          <FormInput
            id='username'
            type='username'
            placeholder='Username'
            autoComplete='off'
            className='text-sm px-[7px] py-1 h-10 font-medium'
            errors={fieldErrors}
          />
          <AvatarSelect errors={fieldErrors} />

          <FormSubmit
            className='w-full h-10 bg-yellow-400 hover:bg-yellow-300'
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Sign up"}
          </FormSubmit>
        </form>
      </CardContent>

      <CardFooter>
        <p className='text-sm text-center mx-auto'>
          Do You have an account?{" "}
          <Link to='/login' className='text-yellow-400'>
            Login
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
