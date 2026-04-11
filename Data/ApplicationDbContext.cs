using Microsoft.EntityFrameworkCore;

namespace Shopv2.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)  : base (options) { 
            
        }

        public DbSet<Shopv2.Models.Product> Product { get; set; }
        public DbSet<Shopv2.Models.Category> Category { get; set; }
    }
}
