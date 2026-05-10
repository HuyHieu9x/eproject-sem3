using Microsoft.EntityFrameworkCore;
using Shopv2.Models;

namespace Shopv2.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)  : base (options) { 
            
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Occasion> Occasions => Set<Occasion>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<Bouquet> Bouquets => Set<Bouquet>();
        public DbSet<Cart> Carts => Set<Cart>();
        public DbSet<CartItem> CartItems => Set<CartItem>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<Recipient> Recipients => Set<Recipient>();
        public DbSet<Product> Products => Set<Product>();

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

            modelBuilder.Entity<Bouquet>()
                .Property(x => x.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<CartItem>()
                .Property(x => x.UnitPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(x => x.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<OrderItem>()
                .Property(x => x.UnitPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Message>()
                .HasOne<Occasion>()
                .WithMany()
                .HasForeignKey(x => x.OccasionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Bouquet>()
                .HasOne<Occasion>()
                .WithMany()
                .HasForeignKey(x => x.OccasionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Cart>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CartItem>()
                .HasOne<Cart>()
                .WithMany()
                .HasForeignKey(x => x.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CartItem>()
                .HasOne<Bouquet>()
                .WithMany()
                .HasForeignKey(x => x.BouquetId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne<Order>()
                .WithMany()
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne<Bouquet>()
                .WithMany()
                .HasForeignKey(x => x.BouquetId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Recipient>()
                .HasOne<Order>()
                .WithMany()
                .HasForeignKey(x => x.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
