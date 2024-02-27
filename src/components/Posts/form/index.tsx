import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPost } from "@/actions/post/createPost";
import Editor from "@/components/Posts/Editor";
import FormCategory from "@/components/Posts/form/FormCategory";
import FormTagsInput from "@/components/Posts/form/FormTagsInput";
import FormTextarea from "@/components/Posts/form/FormTextarea";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CoverImage } from "../CoverImage";
import { Post } from "@/types";
import { updatePost } from "@/actions/post/updatePost";

interface PageFormProps {
  data?: null | Post;
  editMode?: boolean;
}

export default function PageForm({ data, editMode = false }: PageFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [fieldErrors, setFieldErrors] =
    useState<Record<string, string[] | undefined>>();
  const [category, setCategory] = useState<string | undefined>(
    data?.categoryId || undefined
  );
  const [tags, setTags] = useState<string[]>(data?.tags || []);
  const [content, setContent] = useState<string | undefined>(
    data?.content || undefined
  );

  const { mutate, isPending } = useMutation({
    mutationFn: editMode ? updatePost : createPost,
    onSuccess: (result) => {
      setFieldErrors(result.fieldErrors);
      if (result.fieldErrors) {
        toast.error("Error occurred!");
      } else if (result.error) {
        toast.error(result.error);
      } else if (result.data) {
        queryClient.removeQueries({ queryKey: ["posts"] });
        if (!editMode) {
          toast.success("Post has been created.");
          navigate("/posts");
        } else {
          queryClient.removeQueries({ queryKey: ["post"] });
          toast.success("Post has been updated.");
          navigate(`/posts/${result.data}`);
        }
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const sendData = {
      postId: data?.id || "",
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      content: content || "",
      categoryId: category || "",
      tags,
      mainImageFile: formData.get("mainImageUrl") as File,
      isImageChanged: JSON.parse(
        (formData.get("isImageChanged") as string) || "false"
      ),
      originMainImageUrl: data?.mainImageUrl,
    };
    mutate(sendData);
  };

  const onContentChange = (content: string) => {
    setContent(content);
  };

  return (
    <>
      {isPending && <LoadingSpinner />}
      <form className='my-3 space-y-4 mx-4' onSubmit={handleSubmit}>
        <FormCategory value={category} setCategory={setCategory} />
        <CoverImage url={data?.mainImageUrl || ""} />
        <FormTextarea
          id='title'
          defaultValue={data?.title || ""}
          errors={fieldErrors}
        />
        <FormTextarea
          id='description'
          defaultValue={data?.description || ""}
          errors={fieldErrors}
        />
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
