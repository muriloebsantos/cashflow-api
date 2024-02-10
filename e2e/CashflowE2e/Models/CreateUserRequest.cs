namespace CashflowE2e.Models;

public class CreateUserRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }

    public static CreateUserRequest CreateValidRequest() 
    {
        var faker = new Faker();
        var createUserRequest = new CreateUserRequest
        {
            Name = faker.Name.FullName(),
            Email = faker.Internet.Email(),
            Password = faker.Internet.Password(8)
        };

        return createUserRequest;
    }
}
