using FluentValidation;
using SmartInventory.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartInventory.Core.Validators
{
    public class ProductCreateValidator: AbstractValidator<ProductCreateDto>
    {
        public ProductCreateValidator()
        {
            RuleFor(x => x.SKU).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
            RuleFor(x => x.CategoryId).GreaterThan(0).WithMessage("Please select a valid category.");
            RuleFor(x => x.SupplyId).GreaterThan(0).WithMessage("Please select a valid supplier.");
            RuleFor(x => x.Price).GreaterThan(0).WithMessage("Price must be greater than zero.");
            RuleFor(x => x.MinimumQty).GreaterThanOrEqualTo(0);
        }
    }
}
