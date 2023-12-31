using Microsoft.AspNetCore.Mvc;
using UserApi.DTO;
using UserApi.Models;
using UserApi.Application;
using UserApi.Enums;
namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            var users = _userService.GetUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetUserById(int id)
        {
            var user = _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost]
        public ActionResult<User> PostUsers([FromBody] UserDTO userDTO)
        {
            if (_userService.IsEmailInUse(userDTO.Email))
            {
                return BadRequest("E-mail já em uso");
            }

            var user = new User
            {
                FirstName = userDTO.FirstName,
                LastName = userDTO.LastName,
                Email = userDTO.Email,
                Password = userDTO.Password,
                UserType = userDTO.UserType
            };

            _userService.AddUser(user);

            return CreatedAtAction(nameof(GetAllUsers), new { id = user.Id }, user);
        }

        [HttpPut("{id}")]
        public IActionResult PutUsers(int id, [FromBody] UserDTO userDTO)
        {
            var existingUser = _userService.GetUserById(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            if (_userService.IsEmailInUse(userDTO.Email, id))
            {
                return BadRequest("E-mail já em uso");
            }

            existingUser.FirstName = userDTO.FirstName;
            existingUser.LastName = userDTO.LastName;
            existingUser.Email = userDTO.Email;
            existingUser.Password = userDTO.Password;
            existingUser.UserType = userDTO.UserType;

            _userService.UpdateUser(existingUser);

            return NoContent();
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteUsers(int id)
        {
            var existingUser = _userService.GetUserById(id);

            if (existingUser == null)
            {
                return NotFound();
            }

            _userService.DeleteUser(id);

            return NoContent();
        }
    }
}