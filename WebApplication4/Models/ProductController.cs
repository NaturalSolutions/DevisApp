using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApplication4.Models
{
    public class ProductController : ApiController
    {
        List<Product> products = new List<Product>()
        {
            new Product {Id = 1,Name = "Tomato Soup",Category =  " Groceries", Price =1},
            new Product {Id = 2,Name = "Yo-yo",Category =  "Toys", Price =1},
            new Product {Id = 3,Name = "Hammer",Category =  "Hammer", Price =1},
        };

        public IEnumerable<Product> getAllProducts()
        {
            return products;
        }

        public IHttpActionResult GetProduct(int id)
        {
            Product product = products.FirstOrDefault((s) => s.Id == id);
            if(product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }
    }
}
