
using CashflowE2e.Models;
using Newtonsoft.Json;

namespace CashflowE2e;
public class CashFlowClient
{
  protected readonly RestClient _restClient;

  public CashFlowClient()
  {
    _restClient = new RestClient("https://59t5hly7ph.execute-api.us-east-1.amazonaws.com/prod");
  }

  public Task<Result<TResponse>> Post<TResponse>(string resource, object payload, string jwt = null)
    where TResponse : class
  {
    return Execute<TResponse>(Method.Post, resource, payload, jwt);
  }

  public Task<Result<TResponse>> Get<TResponse>(string resource, string jwt = null)
   where TResponse : class
  {
    return Execute<TResponse>(Method.Get, resource, null, jwt);
  }

  private async Task<Result<TResponse>> Execute<TResponse>(Method method, string resource, object payload, string jwt = null)
    where TResponse : class
  {
    var restRequest = new RestRequest(resource, method);

    if (payload is not null)
    {
      restRequest.AddJsonBody(payload);
    }

    if (jwt is not null)
    {
      restRequest.AddHeader("Authorization", jwt);
    }

    var response = await _restClient.ExecuteAsync(restRequest);
    TResponse responsePayload = null;

    if (response.ContentType == "application/json" && !string.IsNullOrEmpty(response.Content))
    {
      responsePayload = JsonConvert.DeserializeObject<TResponse>(response.Content);
    }

    return new Result<TResponse>
    {
      Status = response.StatusCode,
      Payload = responsePayload,
      RawResponse = response.Content
    };
  }
}
