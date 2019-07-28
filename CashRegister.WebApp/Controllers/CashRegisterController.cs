using CashRegister.Core;
using CashRegister.Core.Banks;
using CashRegister.Core.Enums;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace CashRegister.WebApp.Controllers
{
    [Route("api/[controller]")]
    public class CashRegisterController : Controller
    {
        private static Register register = new Register();

        [HttpPost("[action]")]
        public void SetLayout([FromBody] Data data)
        {
            Enum.TryParse<Layouts>(data.Value, out Layouts layoutEnum);
            register.Layout = layoutEnum;
        }

        [HttpPost("[action]")]
        public void Load([FromBody] Data data)
        {
            register.LoadFromString(data.Value);
            register.Calculate();
        }

        [HttpGet("[action]")]
        public Data Save()
        {
            Data data = new Data { Value = register.ToString() };
            return data;
        }

        [HttpGet("[action]")]
        public void Clear()
        {
            register.Clear();
        }

        [HttpGet("[action]")]
        public IEnumerable<Data> LayoutOptions()
        {
            var list = Enum.GetNames(typeof(Layouts)).ToList();

            return Enumerable.Range(0, list.Count).Select(index => new Data
            {
                Value = list[index]
            });
        }

        [HttpGet("[action]")]
        public IEnumerable<Data> Denominations()
        {
            var bank = Bank.InitializeFactories().ExecuteCreation(register.Layout);
            return bank.Denominations.Select(d => new Data { Value = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(d.Name.ToLower()) }).ToList();
        }

        [HttpGet("[action]")]
        public IEnumerable<TransactionData> Transactions()
        {
            var result = new List<TransactionData>();
            for (int i = 0; i < register.NumberOfTransactions(); i++)
            {
                var transaction = register.GetTransaction(i);
                var transactionData = new TransactionData();

                // Add owed and received
                transactionData.Id = i;
                transactionData.Owed = transaction.Owed;
                transactionData.Received = transaction.Received;

                // Add denomination counts
                var change = transaction.Change.Amounts;
                var changeData = new List<int>();
                for (int j = 0; j < change.Count; j++)
                {
                    changeData.Add(change.Values.ElementAt(j));
                }
                transactionData.Change = changeData;
                result.Add(transactionData);
            }
            return result;
        }

        public class TransactionData
        {
            public int Id { get; set; }
            public double Owed { get; set; }
            public double Received { get; set; }
            public IEnumerable<int> Change { get; set; }
        }

        public class Data
        {
            public string Value { get; set; }
        }
    }
}
