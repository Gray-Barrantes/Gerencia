using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;

namespace Gerencia.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FirestoreController : ControllerBase
    {
        private readonly FirestoreDb _firestoreDb;

        public FirestoreController(FirestoreDb firestoreDb)
        {
            _firestoreDb = firestoreDb;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = new List<object>();
            var snapshot = await _firestoreDb.Collection("users").GetSnapshotAsync();

            foreach (var doc in snapshot.Documents)
            {
                users.Add(doc.ToDictionary());
            }
            return Ok(users);
        }
    }
}
