namespace CashflowE2e.Models;

public class CreateUserResponse
{
    public Guid UserId { get; set; }
    public string Token { get; set; }
    public DateTime Expiration { get; set; }
}
