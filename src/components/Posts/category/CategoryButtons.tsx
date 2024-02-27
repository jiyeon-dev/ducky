import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function CategoryButtons() {
  const user = useAuth();

  return (
    <div className='text-right'>
      {user && (
        <Link to='/posts/new'>
          <Button variant='secondary' size='sm'>
            글쓰기
          </Button>
        </Link>
      )}
    </div>
  );
}
