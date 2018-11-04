composer archive create -t dir -n ../

cd ../../
./startFabric.sh
cd hlf_kisa/dist/

composer network install -a hlf_kisa@0.0.1.bna -c PeerAdmin@hlfv1

composer network start -c PeerAdmin@hlfv1 -n hlf_kisa -V 0.0.1 -A admin -S adminpw

composer card delete -c admin@hlf_kisa

composer card import -f admin@hlf_kisa.card

composer-rest-server -c admin@hlf_kisa -n never -d n