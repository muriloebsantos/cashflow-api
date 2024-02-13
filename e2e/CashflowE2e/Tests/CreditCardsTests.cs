using CashflowE2e.Models;

namespace CashflowE2e.Tests;

public class CreditCardsTests
{
    private readonly CashFlowClient _cashflowClient = new CashFlowClient();
    private readonly Faker _faker = new Faker();

    [Fact]
    public async Task Should_Create_Credit_Card() 
    {
        // arrange
        var user = CreateUserRequest.CreateValidRequest();
        var createUserResponse = await _cashflowClient.Post<CreateUserResponse>("users", user);
        var createCreditCardRequest = new CreateCreditCardRequest 
        {
          Name = "Mastercard",
          DueDay = 15,
          ClosingDay = 8
        };

        // act 
        var createCreditCardResponse = 
            await _cashflowClient.Post<GetCreditCardResponse>("credit-cards", createCreditCardRequest, createUserResponse.Payload.Token);

        // assert
        createCreditCardResponse.Status.Should().Be(System.Net.HttpStatusCode.Created, createCreditCardResponse.RawResponse);
        createCreditCardResponse.Payload.Id.Should().NotBeEmpty();
        createCreditCardResponse.Payload.UserId.Should().Be(createUserResponse.Payload.UserId);
        createCreditCardResponse.Payload.Name.Should().Be(createCreditCardRequest.Name);
        createCreditCardResponse.Payload.DueDay.Should().Be(createCreditCardRequest.DueDay);
        createCreditCardResponse.Payload.ClosingDay.Should().Be(createCreditCardRequest.ClosingDay);
    }

    [Fact]
    public async Task Should_List_Credit_Cards() 
    {
        // arrange
        var user = CreateUserRequest.CreateValidRequest();
        var createUserResponse = await _cashflowClient.Post<CreateUserResponse>("users", user);
        var card1 = new CreateCreditCardRequest 
        {
          Name = _faker.Random.AlphaNumeric(10),
          DueDay = 15,
          ClosingDay = 8
        };

        var card2 = new CreateCreditCardRequest 
        {
          Name = _faker.Random.AlphaNumeric(10),
          DueDay = 15,
          ClosingDay = 8
        };

        await _cashflowClient.Post<GetCreditCardResponse>("credit-cards", card1, createUserResponse.Payload.Token);
        await _cashflowClient.Post<GetCreditCardResponse>("credit-cards", card2, createUserResponse.Payload.Token);

        // act
        var getCardsResult = await _cashflowClient.Get<List<GetCreditCardResponse>>("credit-cards", createUserResponse.Payload.Token);

        // assert 
        getCardsResult.Status.Should().Be(System.Net.HttpStatusCode.OK, getCardsResult.RawResponse);
        getCardsResult.Payload.Count.Should().Be(2);
        
        getCardsResult.Payload[0].Id.Should().NotBeEmpty();
        getCardsResult.Payload[0].Name.Should().Be(card1.Name);
        getCardsResult.Payload[0].DueDay.Should().Be(card1.DueDay);
        getCardsResult.Payload[0].ClosingDay.Should().Be(card1.ClosingDay);
        getCardsResult.Payload[0].UserId.Should().Be(createUserResponse.Payload.UserId);

        getCardsResult.Payload[1].Id.Should().NotBeEmpty();
        getCardsResult.Payload[1].Name.Should().Be(card2.Name);
        getCardsResult.Payload[1].DueDay.Should().Be(card2.DueDay);
        getCardsResult.Payload[1].ClosingDay.Should().Be(card2.ClosingDay);
        getCardsResult.Payload[1].UserId.Should().Be(createUserResponse.Payload.UserId);
    }

    // TODO: delete get

    // TODO: update get
}
