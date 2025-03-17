using Blazored.LocalStorage;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace Gerencia.Client.Services
{
    public class AuthService
    {
        private readonly IJSRuntime _js;
        private readonly ILocalStorageService _localStorage;
        private readonly NavigationManager _navigation;

        public AuthService(IJSRuntime js, ILocalStorageService localStorage, NavigationManager navigation)
        {
            _js = js;
            _localStorage = localStorage;
            _navigation = navigation;
        }

        public async Task<bool> LoginWithGoogle()
        {
            var userToken = await _js.InvokeAsync<string>("loginWithGoogle");
            if (!string.IsNullOrEmpty(userToken))
            {
                await _localStorage.SetItemAsync("authToken", userToken);
                return true;
            }
            return false;
        }

        // 🔹 Iniciar sesión con email y contraseña
        public async Task<bool> LoginWithEmail(string email, string password)
        {
            var userToken = await _js.InvokeAsync<string>("loginWithEmail", email, password);
            if (!string.IsNullOrEmpty(userToken))
            {
                await _localStorage.SetItemAsync("authToken", userToken);
                return true;
            }
            return false;
        }

        // 🔹 Registro de usuario con email y contraseña
        public async Task<string> RegisterWithEmail(string email, string password)
        {
            try
            {
                var userToken = await _js.InvokeAsync<string>("registerWithEmail", email, password);
                if (!string.IsNullOrEmpty(userToken))
                {
                    await _localStorage.SetItemAsync("authToken", userToken);
                    return "Registro exitoso";
                }
                return "Error en el registro";
            }
            catch (JSException ex)
            {
                if (ex.Message.Contains("auth/email-already-in-use"))
                {
                    return "Este correo ya está registrado.";
                }
                return "Error inesperado en el registro.";
            }
        }

        // 🔹 Obtener usuario actual
        public async Task<string> GetCurrentUser()
        {
            return await _localStorage.GetItemAsync<string>("authToken");
        }

        // 🔹 Cerrar sesión
        public async Task Logout()
        {
            await _localStorage.RemoveItemAsync("authToken");
            await _js.InvokeVoidAsync("logout");
            _navigation.NavigateTo("/login", forceLoad: true);
        }
    }
}


