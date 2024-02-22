/**
 * [Docs] https://github.com/zenoamaro/react-quill
 */
import ReactQuill, { ReactQuillProps } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import { cn } from "@/lib/utils";
import React from "react";
import { FormErrors } from "../formErrors";

interface QuillProps extends ReactQuillProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ list: "ordered" }, { list: "bullet" }],
  // ["link", "image"],
  ["link"],
];

export const Quill = React.forwardRef<
  React.ElementRef<typeof ReactQuill>,
  QuillProps
>(({ id, modules = undefined, className, errors, ...props }, ref) => {
  const _modules = {
    toolbar: modules ?? toolbarOptions,
  };

  return (
    <div className='space-y-2'>
      <ReactQuill
        id={id}
        ref={ref}
        theme='snow'
        modules={_modules}
        className={cn("", className)}
        {...props}
      />
      <FormErrors id={id} errors={errors} />
    </div>
  );
});
