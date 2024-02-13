using Newtonsoft.Json;

namespace CashflowE2e.Models
{
    public class GetCreditCardResponse
    {
        [JsonProperty("_id")]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Name { get; set; }
        public int DueDay { get; set; }
        public int ClosingDay { get; set; }
    }
}