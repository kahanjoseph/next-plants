const JSONFetch = async (route: string) => {
    const response = await fetch(route);
    if (response.ok){
        return await response.json();
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
}

export {JSONFetch}
