using System.Net;

namespace CashflowE2e.Models
{
    public class Result<T>
    {
        public HttpStatusCode Status { get; set; }
        public T Payload { get; set; }
        public string RawResponse { get; set; }
    }
}