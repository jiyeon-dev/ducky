import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPost } from "@/actions/post/createPost";
import { useAction } from "@/hooks/useAction";
import Editor from "@/components/Posts/Editor";
import FormCategory from "@/components/Posts/form/FormCategory";
import FormTagsInput from "@/components/Posts/form/FormTagsInput";
import FormTextarea from "@/components/Posts/form/FormTextarea";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CoverImage } from "../CoverImage";

export default function PageForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string | undefined>(undefined);

  const onContentChange = (content: string) => {
    setContent(content);
  };

  const { execute, fieldErrors, isLoading } = useAction(createPost, {
    onSuccess() {
      toast.success(`Post has been created`);
      queryClient.removeQueries({ queryKey: ["posts"] });
      navigate("/posts");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    history.pushState({}, "", location.pathname);

    const formData = new FormData(e.target as HTMLFormElement);
    execute({
      title: formData.get("title") as string,
      description: formData.get("title") as string,
      content: content || "",
      categoryId: category || "",
      tags,
      mainImageFile: formData.get("mainImageUrl") as File,
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <form className='my-3 space-y-4 mx-4' onSubmit={handleSubmit}>
        <FormCategory value={category} setCategory={setCategory} />
        <CoverImage />
        <FormTextarea id='title' defaultValue={""} errors={fieldErrors} />
        <FormTextarea id='description' defaultValue={""} errors={fieldErrors} />
        <Editor editable onChange={onContentChange} initialContent={content} />
        <FormTagsInput tags={tags} setTags={setTags} />
        <div className='flex space-x-2 justify-center'>
          <Link to={".."}>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </Link>
          <Button type='submit' variant='destructive'>
            Save
          </Button>
        </div>
      </form>
    </>
  );
}
