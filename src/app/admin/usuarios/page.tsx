import UsuariosTable from "@/components/UsuariosTable";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function Page() {
  return(
    <Suspense fallback={<Loading />}>
      <UsuariosTable/>
    </Suspense>
    
  )
}
