using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;

namespace SampleCoreWebApp.Filters
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class ApiKeyAttribute : Attribute, IAsyncActionFilter
    {
        private const string APIKEYNAME = "X-Api-Key";

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var expectedApiKey = configuration["PORTFOLIO_API_KEY"];

            // Safety check: if no API key is configured, block write operations
            if (string.IsNullOrEmpty(expectedApiKey))
            {
                context.Result = new ContentResult()
                {
                    StatusCode = 401,
                    Content = "API Key is not configured on the server."
                };
                return;
            }

            if (!context.HttpContext.Request.Headers.TryGetValue(APIKEYNAME, out var extractedApiKey))
            {
                context.Result = new ContentResult()
                {
                    StatusCode = 401,
                    Content = "API Key was not provided in headers."
                };
                return;
            }

            if (expectedApiKey != extractedApiKey)
            {
                context.Result = new ContentResult()
                {
                    StatusCode = 403,
                    Content = "Unauthorized access. Invalid API Key."
                };
                return;
            }

            await next();
        }
    }
}
