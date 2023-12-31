using UserApi.Models;
using UserManager.Infrastructure;

namespace UserApi.Application
{
    public class UserService
    {
        private readonly UserRepository _userRepository;

        public UserService(UserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public IEnumerable<User> GetUsers()
        {
            return _userRepository.GetUsers();
        }

        public User GetUserById(int id)
        {
            return _userRepository.GetUserById(id);
        }

        public User GetUserByEmail(string email)
        {
            return _userRepository.GetUserByEmail(email);
        }

        public void AddUser(User user)
        {
            _userRepository.AddUser(user);
        }

        public void UpdateUser(User user)
        {
            _userRepository.UpdateUser(user);
        }

        public void DeleteUser(int id)
        {
            _userRepository.DeleteUser(id);
        }

        public bool IsEmailInUse(string email, int? userIdToExclude = null)
        {
            var existingUser = GetUserByEmail(email);
            return existingUser != null && (userIdToExclude == null || existingUser.Id != userIdToExclude);
        }

    }
}
