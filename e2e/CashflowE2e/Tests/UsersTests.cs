using CashflowE2e;
using CashflowE2e.Models;

namespace CashFlowE2e.Tests;
public class UsersTests
{
    private readonly CashFlowClient _cashflowClient;

    public UsersTests()
    {
        _cashflowClient = new CashFlowClient();
    }

    [Fact]
    public async void Should_Create_User()
    {
        // arrange
        var validUser = CreateUserRequest.CreateValidRequest();

        // act

        var result = await _cashflowClient.Post<CreateUserResponse>("users", validUser);

        // arrange
        result.Status.Should().Be(System.Net.HttpStatusCode.Created);
        result.Payload.UserId.Should().NotBeEmpty();
        result.Payload.Token.Should().NotBeEmpty();
        result.Payload.Expiration.Should().BeAfter(DateTime.Now.AddMinutes(60));
    }
}