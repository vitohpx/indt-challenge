using Microsoft.EntityFrameworkCore;
using System;
using UserApi.Models;
using UserManager.Infrastructure;

namespace UserApi.Infrastructure.Data
{
    public class UserDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        }

        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new UserDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<UserDbContext>>()))
            {
                context.Database.EnsureCreated();

                if (!context.Users.Any())
                {
                    var userManager = serviceProvider.GetRequiredService<UserRepository>();

                    var adminUser = new User
                    {
                        FirstName = "Adm",
                        LastName = "Type",
                        Email = "adm@test.com",
                        Password = "adm123",
                        UserType = Enums.UserType.Admin
                    };
                    userManager.AddUser(adminUser);
                }
            }
        }
    }
}
