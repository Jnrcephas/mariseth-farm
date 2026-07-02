export interface PageProps {
    params: Promise<{
      id: string;
      warehouse_id?: string;
      creditId?: string;
    }>;
  } 


  export type TSearchProps = {
    setFilters: (prev: any) => void; 
    filters?: any
    isLoading: boolean;
    refetch: () => void;
    completed?: boolean;
    pending?: boolean;
    
}

export type TModal = {
  open: boolean;
  setOpen: (open: boolean) => void
  defaultData?: any
  isEdit?: boolean
  refetch?: () => void
}
