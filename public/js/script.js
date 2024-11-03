// public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('/products')
      .then(response => response.json())
      .then(data => {
        const productsDiv = document.getElementById('products');
        data.forEach(product => {
          const productElement = document.createElement('div');
          productElement.textContent = `Product: ${product.lot_id} - ${product.grade}, Price: ${product.sale_price}`;
          productsDiv.appendChild(productElement);
        });
      })
      .catch(error => console.error('Error fetching products:', error));
  });
  