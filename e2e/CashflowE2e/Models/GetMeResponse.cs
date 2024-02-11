using Newtonsoft.Json;

namespace CashflowE2e.Models
{
    public class GetMeResponse
    {
        [JsonProperty("_id")]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public decimal Balance { get; set; }
        public decimal Savings { get; set; }
    }
}