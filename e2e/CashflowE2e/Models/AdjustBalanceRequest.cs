namespace CashflowE2e.Models
{
    public class AdjustBalanceRequest
    {
        public decimal NewBalance { get; set; }
        public decimal NewSavings { get; set; }
        public bool CreateEntry { get; set; }
    }
}