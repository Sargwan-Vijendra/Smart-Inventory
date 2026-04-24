using SmartInventory.Core.DTOs;
using System.Threading.Tasks;

namespace SmartInventory.Data.Interfaces
{
    public interface IProductManagementRepository
    {
        Task<ProductDetailViewDto> GetByProductId(int productId);
        Task<int> CreateProduct(ProductCreateDto dto);

        Task<int> UpdateProduct(ProductUpdateDto dto);
        Task<bool> DeleteProduct(int id);

        Task<PagedResponse<ProductDetailViewDto>> GetProductsPaged(string? search, int? categoryId, int? supplierId, int pageNumber, int pageSize);
    }
}
