import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/useAction";
import { login } from "@/actions/auth/login";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/Kanban/form/formInput";
import { FormSubmit } from "@/components/Kanban/form/formSubmit";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function LoginPage() {
  const navigate = useNavigate();

  const { execute, isLoading, fieldErrors } = useAction(login, {
    onSuccess: () => {
      navigate("/");
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
        <CardDescription className='capitalize'>login</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
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
          <FormSubmit
            className='w-full h-10 bg-yellow-400 hover:bg-yellow-300'
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : "Sign in"}
          </FormSubmit>
        </form>
      </CardContent>

      <CardFooter>
        <p className='text-sm text-center mx-auto'>
          You don't have an account?{" "}
          <Link to='/register' className='text-yellow-400'>
            Register
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
