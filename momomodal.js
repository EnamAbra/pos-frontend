function openMomoModal() {
  document.getElementById('momo-modal').style.display = 'flex';

  // reset UI
  document.getElementById('momo-phone').value = '';
  document.getElementById('momo-err').textContent = '';

  // reset selected network
  document.querySelectorAll('.net-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.net-btn[data-net="mtn"]').classList.add('active');

  function calculateTotal() {
  let subtotal = 0;

  Object.values(cart).forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax - discountAmt;

  return total;
}
const total = calculateTotal();
document.getElementById('momo-amount-display').textContent = `GH₵ ${total.toFixed(2)}`;
}
  // show amount (optional)

  
function closeMomoModal() {
  document.getElementById('momo-modal').style.display = 'none';
}
function selectNetwork(btn) {
  document.querySelectorAll('.net-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}


async function initiateMomo() {
  const phone = document.getElementById('momo-phone').value.trim();
  const networkBtn = document.querySelector('.net-btn.active');
  const network = networkBtn?.dataset.net;

  if (!phone || !network) {
    document.getElementById('momo-err').textContent = "Enter phone and select network";
    return;
  }

  const btn = document.getElementById('momo-initiate-btn');
  btn.disabled = true;
  btn.textContent = "Processing...";

  try {
    const res = await fetch(`${API}/payments/momo/initiate`, {
      method: 'POST',
      headers: H,
      body: JSON.stringify({
        phone,
        network,
        cart_items: Object.values(cart),
      }),
    });

    const data = await res.json();

    if (!data.success) {
      document.getElementById('momo-err').textContent = "Failed to start payment";
      btn.disabled = false;
      btn.textContent = "Send prompt";
      return;
    }

    // ✅ CLOSE MODAL
    closeMomoModal();

    // ✅ REDIRECT TO PAYSTACK
    window.location.href = data.authorization_url;

  } catch (err) {
    console.error(err);
    document.getElementById('momo-err').textContent = "Network error";
    btn.disabled = false;
    btn.textContent = "Send prompt";
  }
}