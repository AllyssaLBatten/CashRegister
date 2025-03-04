﻿using CashRegister.Core.Denominations;
using NUnit.Framework;

namespace CashRegister.UnitTests.Denominations
{
    public class PennyTest
    {
        private Penny penny;

        [SetUp]
        public void Setup()
        {
            penny = new Penny();
        }

        [Test]
        public void GetName()
        {
            Assert.AreEqual("penny", penny.Name);
        }

        [Test]
        public void GetValue()
        {
            Assert.AreEqual(0.01, penny.Value, 0.01);
        }

        [Test]
        public void MakeChange_InValueIsGreater()
        {
            int count = penny.MakeChange(0.07);
            Assert.AreEqual(7, count);
        }

        [Test]
        public void MakeChange_InValueIsEqual()
        {
            int count = penny.MakeChange(0.01);
            Assert.AreEqual(1, count);
        }

        [Test]
        public void MakeChange_InValueIsLess()
        {
            int count = penny.MakeChange(0.00);
            Assert.AreEqual(0, count);
        }

        [Test]
        public void GetRemainder_CountIsHigh()
        {
            double remainder = penny.GetRemainder(0.00, 1);
            Assert.AreEqual(-0.01, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsEqual()
        {
            double remainder = penny.GetRemainder(0.01, 1);
            Assert.AreEqual(0.00, remainder, 0.001);
        }

        [Test]
        public void GetRemainder_CountIsLow()
        {
            double remainder = penny.GetRemainder(0.07, 5);
            Assert.AreEqual(0.02, remainder, 0.001);
        }
    }
}
