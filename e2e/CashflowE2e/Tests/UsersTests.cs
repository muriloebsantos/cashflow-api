using CashflowE2e;
using CashflowE2e.Models;

namespace CashFlowE2e.Tests;

public class UsersTests
{
    private readonly CashFlowClient _cashflowClient = new CashFlowClient();
    private readonly Faker _faker = new Faker();

    [Fact]
    public async Task Should_Create_User()
    {
        // arrange
        var validUser = CreateUserRequest.CreateValidRequest();

        // act

        var result = await _cashflowClient.Post<CreateUserResponse>("users", validUser);

        // arrange
        result.Status.Should().Be(System.Net.HttpStatusCode.Created, result.RawResponse);
        result.Payload.UserId.Should().NotBeEmpty();
        result.Payload.Token.Should().NotBeEmpty();
        result.Payload.Expiration.Should().BeAfter(DateTime.Now.AddMinutes(60));
    }

    [Fact]
     public async Task Should_Not_Create_User_With_Existing_Email() 
     {
        // arrange
        var firstUser = CreateUserRequest.CreateValidRequest();
        await _cashflowClient.Post<CreateUserResponse>("users", firstUser);
        var secondUser = new CreateUserRequest 
        {
          Email = firstUser.Email,
          Password = firstUser.Password
        };

        // act
        var result = await _cashflowClient.Post<ErrorResult>("users", secondUser);

        // arrange
        result.Status.Should().Be(System.Net.HttpStatusCode.Conflict, result.RawResponse);
        result.Payload.Error.Should().Be("Email já cadastrado no sistema");
     }

    [Fact]
     public async Task Should_Authenticate_User() 
     {
        // arrange
        var user = CreateUserRequest.CreateValidRequest();
        var createUserResponse = await _cashflowClient.Post<CreateUserResponse>("users", user);
        var authRequest = new AuthUserRequest 
        {
          Email = user.Email,
          Password = user.Password
        };

        // act
        var result = await _cashflowClient.Post<CreateUserResponse>("token", authRequest);

        // arrange
        result.Status.Should().Be(System.Net.HttpStatusCode.OK, result.RawResponse);
        result.Payload.UserId.Should().Be(createUserResponse.Payload.UserId);
        result.Payload.Token.Should().NotBeEmpty();
        result.Payload.Expiration.Should().BeAfter(DateTime.Now.AddMinutes(60));
     }

     [Fact]
     public async Task Should_Not_Authenticate_User() 
     {
        // arrange
        var user = CreateUserRequest.CreateValidRequest();
        await _cashflowClient.Post<CreateUserResponse>("users", user);
        var authRequest = new AuthUserRequest 
        {
          Email = user.Email,
          Password = "wrong password"
        };

        // act
        var result = await _cashflowClient.Post<ErrorResult>("token", authRequest);

        // arrange
        result.Status.Should().Be(System.Net.HttpStatusCode.Unauthorized, result.RawResponse);
        result.Payload.Error.Should().Be("E-mail ou senha inválido");
     }

    [Fact]
     public async Task Should_Not_Authenticate_Unregistered_User() 
     {
        // arrange
        var authRequest = new AuthUserRequest 
        {
          Email = _faker.Internet.Email(),
          Password = "random password"
        };

        // act
        var result = await _cashflowClient.Post<ErrorResult>("token", authRequest);

        // arrange
        result.Status.Should().Be(System.Net.HttpStatusCode.Unauthorized, result.RawResponse);
        result.Payload.Error.Should().Be("E-mail ou senha inválido");
     }

     [Fact]
     public async Task Should_Block_User_When_5_Wrong_Login_Attempts() 
     {
        // arrange
        var user = CreateUserRequest.CreateValidRequest();
        await _cashflowClient.Post<CreateUserResponse>("users", user);
        var authRequest = new AuthUserRequest 
        {
          Email = user.Email,
          Password = "wrong password"
        };

        // act
        Result<ErrorResult> result = null;
        for (int i = 0; i < 5; i++)
        {
            result = await _cashflowClient.Post<ErrorResult>("token", authRequest);
        }
        
        // arrange
        result.Status.Should().Be(System.Net.HttpStatusCode.Unauthorized, result.RawResponse);
        result.Payload.Error.Should().Be("A senha do usuário está bloqueada por tentativas de login excessivas");
     }

     [Fact]
     public async Task Should_Get_Me() 
     {
        // arrange
        var user = CreateUserRequest.CreateValidRequest();
        var createUserResponse = await _cashflowClient.Post<CreateUserResponse>("users", user);
 
        // act
        var getMeResponse = await _cashflowClient.Get<GetMeResponse>("me", createUserResponse.Payload.Token);

        // arrange
        getMeResponse.Status.Should().Be(System.Net.HttpStatusCode.OK, getMeResponse.RawResponse);
        getMeResponse.Payload.Id.Should().Be(createUserResponse.Payload.UserId);
        getMeResponse.Payload.Name.Should().Be(user.Name);
        getMeResponse.Payload.Email.Should().Be(user.Email);
        getMeResponse.Payload.Balance.Should().Be(0);
        getMeResponse.Payload.Savings.Should().Be(0);
     }

     [Theory]
     [InlineData(true)]
     [InlineData(false)] 
      public async Task Should_Update_Balance(bool createEntry) 
      {
        // arrange
        var user = CreateUserRequest.CreateValidRequest();
        var createUserResponse = await _cashflowClient.Post<CreateUserResponse>("users", user);
        var adjustBalanceRequestRequest = new AdjustBalanceRequest
        {
          CreateEntry = createEntry,
          NewBalance = Math.Round(_faker.Random.Decimal(0.01m, 100000), 2),
          NewSavings = Math.Round(_faker.Random.Decimal(0.01m, 100000), 2)
        };

        // act 
        var adjustBalanceResponse = await _cashflowClient.Post<object>("me/balance-adjustment", adjustBalanceRequestRequest, createUserResponse.Payload.Token);
        var getMeResponse = await _cashflowClient.Get<GetMeResponse>("me", createUserResponse.Payload.Token);

        // assert
        adjustBalanceResponse.Status.Should().Be(System.Net.HttpStatusCode.Created, adjustBalanceResponse.RawResponse);
        getMeResponse.Payload.Balance.Should().Be(adjustBalanceRequestRequest.NewBalance);
        getMeResponse.Payload.Savings.Should().Be(adjustBalanceRequestRequest.NewSavings);
      }
}