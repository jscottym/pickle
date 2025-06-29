export const useLocalDev = () => {
    const  config = useRuntimeConfig();
    return computed(()=> config.public.localDevUid?.length ? config.public.localDevUid : undefined)
}