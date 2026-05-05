using Microsoft.EntityFrameworkCore;
using Shopv2.Models;

namespace Shopv2.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)  : base (options) { 
            
        }

        public DbSet<Shopv2.Models.Product> Product { get; set; }
        public DbSet<Shopv2.Models.Category> Category { get; set; }
        public DbSet<User> Users => Set<User>();
        public DbSet<Occasion> Occasions => Set<Occasion>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<Bouquet> Bouquets => Set<Bouquet>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Recipient> Recipients => Set<Recipient>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique();

            modelBuilder.Entity<Cart>()
                .HasIndex(x => x.UserId)
                .IsUnique();

            modelBuilder.Entity<Recipient>()
                .HasIndex(x => x.OrderId)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(x => x.Cart)
                .WithOne(x => x.User)
                .HasForeignKey<Cart>(x => x.UserId);

            modelBuilder.Entity<User>()
                .HasMany(x => x.Orders)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<Occasion>()
                .HasMany(x => x.Bouquets)
                .WithOne(x => x.Occasion)
                .HasForeignKey(x => x.OccasionId);

            modelBuilder.Entity<Occasion>()
                .HasMany(x => x.Messages)
                .WithOne(x => x.Occasion)
                .HasForeignKey(x => x.OccasionId);

            modelBuilder.Entity<Cart>()
                .HasMany(x => x.Items)
                .WithOne(x => x.Cart)
                .HasForeignKey(x => x.CartId);

            modelBuilder.Entity<Order>()
                .HasMany(x => x.Items)
                .WithOne(x => x.Order)
                .HasForeignKey(x => x.OrderId);

            modelBuilder.Entity<Order>()
                .HasOne(x => x.Recipient)
                .WithOne(x => x.Order)
                .HasForeignKey<Recipient>(x => x.OrderId);
        }
    }
}
