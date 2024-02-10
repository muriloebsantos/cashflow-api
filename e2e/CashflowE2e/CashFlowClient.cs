
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

  public async Task<Result<TResponse>> Post<TResponse>(string resource, object payload, string jwt = null) 
    where TResponse : class
  {
    var restRequest = new RestRequest(resource, Method.Post);
    restRequest.AddJsonBody(payload);

    if(jwt != null) 
    {

    }

    var response = await _restClient.ExecuteAsync(restRequest);
    TResponse responsePayload = null;

    if(response.ContentType == "application/json" && !string.IsNullOrEmpty(response.Content)) 
    {
      responsePayload = JsonConvert.DeserializeObject<TResponse>(response.Content);
    }

    return new Result<TResponse>
    {
      Status = response.StatusCode,
      Payload = responsePayload
    };
  }
}
