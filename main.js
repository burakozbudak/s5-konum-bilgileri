import axios from 'axios';

// Aşağıdaki Fonksiyonu değiştirmeyin.
async function ipAdresimiAl() {
  return await axios({
    method: 'get',
    url: 'https://apis.ergineer.com/ipadresim',
  }).then(function (response) {
    return response.data;
  });
}

const ipAdresim = await ipAdresimiAl();
console.log(ipAdresim);

/*
  AMAÇ:
  - location_card.png dosyasındakine benzer dinamik bir card oluşturmak.
  - HTML ve CSS hazır, önce IP adresini, sonra bunu kullanarak diğer bilgileri alacağız.

	ADIM 1: IP kullanarak verileri almak
  getData fonskiyonunda axios kullanarak şu adrese GET sorgusu atacağız: https://apis.ergineer.com/ipgeoapi/{ipAdresiniz}

  Fonksiyon gelen datayı geri dönmeli.

  Not: Request sonucu gelen datayı browserda network tabından inceleyin.
  İpucu: Network tabıından inceleyemezseniz GET isteklerini gönderdiğiniz URL'i direkt browserda açabildiğinizi unutmayın. 😉

  Bu fonksiyonda return ettiğiniz veri, Adım 2'de oluşturacağınız component'de argüman olarak kullanılıyor. Bu yüzden, veride hangi key-value çiftleri olduğunu inceleyin.
*/
async function getData() {
  const ipAdresim = await ipAdresimiAl();
  const url = `https://apis.ergineer.com/ipgeoapi/${ipAdresim}`;
  return axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    })
    .finally(() => {
      console.log('Request completed');
    });
}
/*
	ADIM 2: Alınan veriyi sayfada gösterecek componentı oluşturmak
  getData ile aldığımız konum bazlı veriyi sayfada göstermek için cardOlustur fonskiyonu kullanılacak. DOM metodlarını ve özelliklerini kullanarak aşağıdaki yapıyı oluşturun ve dönün (return edin).

  Not: Ülke Bayrağını bu linkten alabilirsiniz:
  'https://flaglog.com/codes/standardized-rectangle-120px/{ülkeKodu}.png';

	<div class="card">
    <img src={ülke bayrağı url} />
    <div class="card-info">
      <h3 class="ip">{ip adresi}</h3>
      <p class="ulke">{ülke bilgisi (ülke kodu)}</p>
      <p>Enlem: {enlem} Boylam: {boylam}</p>
      <p>Şehir: {şehir}</p>
      <p>Saat dilimi: {saat dilimi}</p>
      <p>Para birimi: {para birimi}</p>
      <p>ISP: {isp}</p>
    </div>
  </div>
*/

function cardOlustur(/* kodlar buraya */ data) {
  // Kart konteynerını oluştur
  const card = document.createElement('div');
  card.className = 'card';
  // Ülke bayrağını oluştur ve ekle
  const img = document.createElement('img');
  img.src = `https://flaglog.com/codes/standardized-rectangle-120px/${data.ülkeKodu}.png`;
  img.alt = `${data.ülke} bayrağı`;
  card.appendChild(img);

  // Kart bilgileri konteynerını oluştur
  const cardInfo = document.createElement('div');
  cardInfo.className = 'card-info';
  // IP adresi bilgisi
  const ip = document.createElement('h3');
  ip.className = 'ip';
  ip.textContent = data.sorgu;
  cardInfo.appendChild(ip);
  // Ülke bilgisi ve ülke kodu
  const ulke = document.createElement('p');
  ulke.className = 'ulke';
  ulke.textContent = `${data.ülke} (${data.ülkeKodu})`;
  cardInfo.appendChild(ulke);
  // Enlem ve boylam bilgisi
  const enlemBoylam = document.createElement('p');
  enlemBoylam.textContent = `Enlem: ${data.enlem} - Boylam: ${data.boylam}`;
  cardInfo.appendChild(enlemBoylam);
  // Şehir bilgisi
  const sehir = document.createElement('p');
  sehir.textContent = `Şehir: ${data.bölgeAdı}`;
  cardInfo.appendChild(sehir);
  // Saat dilimi bilgisi
  const saatDilimi = document.createElement('p');
  saatDilimi.textContent = `Saat dilimi: ${data.saatdilimi}`;
  cardInfo.appendChild(saatDilimi);
  // Para birimi bilgisi
  const paraBirimi = document.createElement('p');
  paraBirimi.textContent = `Para birimi: ${data.parabirimi}`;
  cardInfo.appendChild(paraBirimi);
  // ISP bilgisi
  const isp = document.createElement('p');
  isp.textContent = `ISP: ${data.isp}`;
  cardInfo.appendChild(isp);
  // Kart bilgilerini karta ekle
  card.appendChild(cardInfo);
  // Kartı geri döndür
  return card;
}
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const container = document.querySelector('.container');
    container.innerHTML = ''; // Önceki içeriği temizle
    const data = await getData();
    const card = cardOlustur(data);
    container.appendChild(card); // Yeni kartı ekle
  } catch (error) {
    console.error('Error during initialization:', error);
    document.querySelector('.container').innerHTML =
      '<p>Veri yüklenirken bir hata oluştu.</p>';
  } finally {
    console.log('Initialization completed');
  }
});

// Buradan sonrasını değiştirmeyin, burası yazdığınız kodu sayfaya uyguluyor.
getData().then((response) => {
  const cardContent = cardOlustur(response);
  const container = document.querySelector('.container');
  container.appendChild(cardContent);
});
