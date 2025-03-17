using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace Gerencia.Client.Services
{
    public class FirestoreService
    {
        private readonly IJSRuntime _js;

        public FirestoreService(IJSRuntime js)
        {
            _js = js;
        }
        public async Task<bool> AgregarGasto(string userId, double monto, string categoria, string fecha)
        {
            var resultado = await _js.InvokeAsync<string>("addGasto", userId, monto, categoria, fecha);
            return !string.IsNullOrEmpty(resultado);
        }

        public async Task<bool> AgregarIngreso(string userId, double monto, string fuente, string fecha)
        {
            var resultado = await _js.InvokeAsync<string>("addIngreso", userId, monto, fuente, fecha);
            return !string.IsNullOrEmpty(resultado);
        }
    }
}
