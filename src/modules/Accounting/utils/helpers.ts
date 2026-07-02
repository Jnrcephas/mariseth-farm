export function countUniqueFarms(products: any[]) {
    
    const uniqueFarmIds = new Set();
    
    if (products && Array.isArray(products)) {
        products.forEach(product => {
            // Check if farm exists and has an id
            if (product?.farm && product?.farm?.id) {
                uniqueFarmIds.add(product.farm.id);
            }
        });
    }
    
    return uniqueFarmIds.size;
}