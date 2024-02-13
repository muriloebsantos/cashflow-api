namespace CashflowE2e.Models
{
    public class CreateCreditCardRequest
    {
        public string Name { get; set; }
        public int DueDay { get; set; }
        public int ClosingDay { get; set; }
    }
}