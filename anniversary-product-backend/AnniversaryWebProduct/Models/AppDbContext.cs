using AnniversaryWebProduct.Factory;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Reflection.Emit;
namespace AnniversaryWebProduct.Models

{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        { 
        }
            public DbSet<Chat> Chats { get; set; }
            public DbSet<HistoryInstance> HistoryInstance { get; set; }
            public DbSet<MemoryItem> MemoryItem { get; set; }
            public DbSet<Image> Images { get; set; }
            public DbSet<Video> Videos { get; set; }
            public DbSet<Call> Call { get; set; }
        public DbSet<Time> Timer { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Chat>()
            .Property(e => e.MessageType)
            .HasConversion<string>();

            modelBuilder.Entity<Chat>()
            .Property(e => e.Author)
            .HasConversion<string>();
            modelBuilder.Entity<Call>()
            .Property(e => e.CallState)
            .HasConversion<string>();


            // HistoryInstance → MemoryItems
            modelBuilder.Entity<MemoryItem>()
                .HasOne(m => m.HistoryInstance)
                .WithMany(h => h.MemoryItems)
                .HasForeignKey(m => m.HistoryInstanceId)
                .OnDelete(DeleteBehavior.Cascade);

            // MemoryItem → Video
            modelBuilder.Entity<MemoryItem>()
                .HasOne(m => m.Video)
                .WithOne(v => v.MemoryItem)
                .HasForeignKey<MemoryItem>(m => m.VideoId)
                .OnDelete(DeleteBehavior.Restrict);

            // MemoryItem → Image
            modelBuilder.Entity<MemoryItem>()
                .HasOne(m => m.Image)
                .WithOne(i => i.MemoryItem)
                .HasForeignKey<MemoryItem>(m => m.ImageId)
                .OnDelete(DeleteBehavior.Restrict);

            // MemoryItem → Chat
            modelBuilder.Entity<MemoryItem>()
                .HasOne(m => m.Chat)
                .WithOne(c => c.MemoryItem)
                .HasForeignKey<MemoryItem>(m => m.ChatId);

            // Chat → Calls
            modelBuilder.Entity<Chat>()
                .HasOne(c => c.Call)
                .WithOne(ca => ca.Chat)
                .HasForeignKey<Call>(ca => ca.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            //seed
            modelBuilder.Entity<Time>().HasData(new
            {
                Id= 1,
                TimerName ="Anniversary Date",
                DateStart = new DateTime(2025, 6, 25, 12, 0, 0,DateTimeKind.Utc),
                DateEnd = new DateTime(2025, 6, 25, 12, 0, 0, DateTimeKind.Utc),
                IsActive = true,
            });
        }
        protected override void ConfigureConventions(ModelConfigurationBuilder builder)
        {
            builder.Properties<DateTime>()
                .HaveConversion<UtcDateTimeConverter>();

            builder.Properties<DateTime?>()
                .HaveConversion<NullableUtcDateTimeConverter>();
        }


    }
}
